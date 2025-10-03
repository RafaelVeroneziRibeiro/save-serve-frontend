import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Search,
  Download,
  Brain,
  Loader2,
  TrendingUp,
  Package,
} from "lucide-react";
import { Product } from "../../types";
import { analyzeInventoryWithAI, AIAnalysis } from "../../services/aiService";

interface StockTabProps {
  products: Product[];
}

const StockTab: React.FC<StockTabProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "vencido" | "vencendo" | "ok"
  >("all");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === "all") return true;

      const now = new Date();
      const validade = new Date(product.dataValidade);
      const daysUntilExpiry = Math.ceil(
        (validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (filterStatus === "vencido") return daysUntilExpiry <= 0;
      if (filterStatus === "vencendo")
        return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
      if (filterStatus === "ok") return daysUntilExpiry > 7;

      return true;
    });
  }, [products, searchTerm, filterStatus]);

  // Estatísticas
  const stats = useMemo(() => {
    const now = new Date();
    let vencidos = 0;
    let vencendo = 0;
    let ok = 0;

    products.forEach((product) => {
      const validade = new Date(product.dataValidade);
      const days = Math.ceil(
        (validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days <= 0) vencidos++;
      else if (days <= 7) vencendo++;
      else ok++;
    });

    return { vencidos, vencendo, ok };
  }, [products]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const problemProducts = products.filter((p) => {
        const days = Math.ceil(
          (new Date(p.dataValidade).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return days <= 30;
      });

      const analysis = await analyzeInventoryWithAI(
        problemProducts.slice(0, 50)
      );
      setAiAnalysis(analysis);
      setShowAI(true);
    } catch (error) {
      console.error("Erro ao analisar:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Nome",
      "Data Entrada",
      "Data Validade",
      "Valor",
      "Quantidade",
      "Status",
    ];
    const rows = filteredProducts.map((p) => {
      const days = Math.ceil(
        (new Date(p.dataValidade).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const status = days <= 0 ? "Vencido" : days <= 7 ? "Vencendo" : "OK";
      return [
        p.nome,
        p.dataEntrada,
        p.dataValidade,
        p.valor.toFixed(2),
        p.quantidade || 0,
        status,
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estoque_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Estoque Completo</h2>
        <div className="flex gap-2">
          <button
            onClick={analyzeWithAI}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analisando...
              </>
            ) : (
              <>
                <Brain size={16} />
                Analisar com IA
              </>
            )}
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-800">
                {products.length}
              </p>
            </div>
            <Package className="text-slate-400" size={24} />
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-700">
                {stats.vencidos}
              </p>
            </div>
            <AlertTriangle className="text-red-400" size={24} />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Vencendo (7d)</p>
              <p className="text-2xl font-bold text-yellow-700">
                {stats.vencendo}
              </p>
            </div>
            <AlertTriangle className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">OK</p>
              <p className="text-2xl font-bold text-green-700">{stats.ok}</p>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Painel de IA */}
      {showAI && aiAnalysis && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Brain className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Insights da IA - Google Gemini
                </h3>
                <p className="text-sm text-slate-600">
                  Análise inteligente do estoque
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAI(false)}
              className="text-slate-500 hover:text-slate-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-slate-700">
              {aiAnalysis.resumo}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {aiAnalysis.alertas.slice(0, 3).map((alerta, i) => {
              const cores = {
                critico: "bg-red-50 border-red-200 text-red-700",
                alerta: "bg-orange-50 border-orange-200 text-orange-700",
                aviso: "bg-yellow-50 border-yellow-200 text-yellow-700",
                info: "bg-blue-50 border-blue-200 text-blue-700",
              };

              return (
                <div
                  key={i}
                  className={`${cores[alerta.tipo]} border rounded-lg p-3`}
                >
                  <p className="font-semibold text-sm mb-1">{alerta.titulo}</p>
                  <p className="text-xs opacity-90">{alerta.mensagem}</p>
                  <p className="text-xs mt-2 font-medium">→ {alerta.acao}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/80 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-red-600">
                {aiAnalysis.metricas.vencidos}
              </p>
              <p className="text-xs text-slate-600">Vencidos</p>
            </div>
            <div className="bg-white/80 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-orange-600">
                {aiAnalysis.metricas.criticos}
              </p>
              <p className="text-xs text-slate-600">Críticos</p>
            </div>
            <div className="bg-white/80 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-yellow-600">
                {aiAnalysis.metricas.avisos}
              </p>
              <p className="text-xs text-slate-600">Avisos</p>
            </div>
            <div className="bg-white/80 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-blue-600">
                {aiAnalysis.metricas.estoqueBaixo}
              </p>
              <p className="text-xs text-slate-600">Baixo</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produto..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(["all", "vencido", "vencendo", "ok"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? status === "vencido"
                      ? "bg-red-600 text-white"
                      : status === "vencendo"
                      ? "bg-yellow-600 text-white"
                      : status === "ok"
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status === "all"
                  ? "Todos"
                  : status === "vencido"
                  ? "Vencidos"
                  : status === "vencendo"
                  ? "Vencendo"
                  : "OK"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Produto
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Data Entrada
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Data Saída
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Data Validade
                </th>
                <th className="text-right p-4 font-semibold text-slate-700">
                  Valor
                </th>
                <th className="text-center p-4 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const now = new Date();
                  const validade = new Date(product.dataValidade);
                  const daysUntilExpiry = Math.ceil(
                    (validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpired = daysUntilExpiry <= 0;
                  const isExpiringSoon = daysUntilExpiry <= 7;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-4 font-medium text-slate-800">
                        {product.nome}
                      </td>
                      <td className="p-4 text-slate-600">
                        {new Date(product.dataEntrada).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-4 text-slate-600">
                        {product.dataSaida
                          ? new Date(product.dataSaida).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {new Date(product.dataValidade).toLocaleDateString(
                          "pt-BR"
                        )}
                        <span className="block text-xs text-slate-400">
                          {daysUntilExpiry < 0
                            ? `${Math.abs(daysUntilExpiry)}d atrás`
                            : `em ${daysUntilExpiry}d`}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-green-600">
                        R$ {product.valor.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <AlertTriangle size={12} />
                            Vencido
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <AlertTriangle size={12} />
                            Vencendo
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-slate-500 text-center">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>
    </div>
  );
};

export default StockTab;
