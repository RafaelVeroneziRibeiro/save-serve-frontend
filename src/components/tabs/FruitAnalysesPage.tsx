import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Apple, Loader2, AlertTriangle, Clock, TrendingUp, Package, DollarSign, Thermometer, Info } from 'lucide-react';
import { analyzeFruitImage, FruitAnalysis } from '../../services/FruitService';

const FruitAnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FruitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ image: string; result: FruitAnalysis; timestamp: Date }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Cleanup da câmera
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handler para upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Não foi possível acessar a câmera');
      console.error(err);
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Capturar foto
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        setAnalysis(null);
        setError(null);
        stopCamera();
      }
    }
  };

  // Analisar imagem
  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];

      const result = await analyzeFruitImage(base64Data, mimeType);
      setAnalysis(result);

      // Adiciona ao histórico se foi identificada
      if (result.estado !== 'nao_identificado' && result.diasValidade >= 0) {
        setAnalysisHistory(prev => [
          { image: selectedImage, result, timestamp: new Date() },
          ...prev.slice(0, 4) // Mantém apenas os 5 mais recentes
        ]);
      }

      if (result.estado === 'nao_identificado' || result.diasValidade === -1) {
        setError('Não foi possível identificar uma fruta na imagem. Tente com melhor iluminação.');
      }
    } catch (err: any) {
      setError('Erro ao analisar imagem. Tente novamente.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Limpar análise
  const clearAnalysis = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
    stopCamera();
  };

  // Obter cores do estado
  const getStateColors = (estado: string) => {
    const colorMap: Record<string, any> = {
      excelente: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-500' },
      bom: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-500' },
      regular: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-500' },
      ruim: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-500' },
      vencido: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-500' },
      nao_identificado: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-500' }
    };
    return colorMap[estado] || colorMap.nao_identificado;
  };

  const getStateEmoji = (estado: string) => {
    const emojiMap: Record<string, string> = {
      excelente: '🌟',
      bom: '✅',
      regular: '⚠️',
      ruim: '🔴',
      vencido: '💀',
      nao_identificado: '❓'
    };
    return emojiMap[estado] || '❓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-green-500 p-3 rounded-2xl shadow-lg">
              <Apple className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Análise de Frutas com IA</h1>
              <p className="text-slate-600 mt-1">Verifique qualidade e validade através de inteligência artificial</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel Principal - Análise */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Upload/Câmera */}
            {!selectedImage && !isCameraActive && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Escolha uma foto</h2>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Upload size={48} />
                    <div className="text-center">
                      <p className="font-bold text-lg">Enviar Foto</p>
                      <p className="text-sm opacity-90">Da sua galeria</p>
                    </div>
                  </button>

                  <button
                    onClick={startCamera}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Camera size={48} />
                    <div className="text-center">
                      <p className="font-bold text-lg">Tirar Foto</p>
                      <p className="text-sm opacity-90">Com a câmera</p>
                    </div>
                  </button>
                </div>

                {/* Dicas */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Dicas para melhores resultados:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use boa iluminação natural ou artificial</li>
                        <li>• Aproxime a câmera da fruta (15-30cm)</li>
                        <li>• Certifique-se que a fruta está em foco</li>
                        <li>• Prefira fundo liso (mesa, prato branco)</li>
                        <li>• Mostre a fruta completa na imagem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Câmera Ativa */}
            {isCameraActive && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Camera size={24} />
                    Capturar Foto
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-8 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <X size={24} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Imagem Selecionada */}
            {selectedImage && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="relative mb-4">
                  <img
                    src={selectedImage}
                    alt="Fruta selecionada"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  <button
                    onClick={clearAnalysis}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {!analysis && (
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-4 font-bold disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Analisando com IA...
                      </>
                    ) : (
                      <>
                        <Apple size={24} />
                        Analisar Fruta
                      </>
                    )}
                  </button>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-red-600" size={20} />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resultado da Análise */}
            {analysis && analysis.estado !== 'nao_identificado' && (
              <div className="space-y-4">
                {/* Card Principal */}
                <div className={`${getStateColors(analysis.estado).bg} border-2 ${getStateColors(analysis.estado).border} rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getStateEmoji(analysis.estado)}</span>
                      <div>
                        <h3 className={`text-3xl font-bold ${getStateColors(analysis.estado).text}`}>
                          {analysis.fruta}
                        </h3>
                        <p className="text-slate-600 capitalize mt-1">
                          Estado: <span className="font-semibold">{analysis.estado.replace('_', ' ')}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`${getStateColors(analysis.estado).badge} text-white px-4 py-2 rounded-full font-bold text-2xl`}>
                        {analysis.diasValidade === 0 ? 'HOJE' : `${analysis.diasValidade}d`}
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Validade estimada</p>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-4 mb-4">
                    <p className="text-slate-700">{analysis.detalhes}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/70 rounded-full h-3">
                      <div
                        className={`${getStateColors(analysis.estado).badge} h-3 rounded-full transition-all`}
                        style={{ width: `${analysis.confianca * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {(analysis.confianca * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Grid de Informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sinais Visíveis */}
                  {analysis.sinaisVisiveis && analysis.sinaisVisiveis.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Package size={20} className="text-blue-600" />
                        Sinais Visíveis
                      </h4>
                      <ul className="space-y-2">
                        {analysis.sinaisVisiveis.map((sinal, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>{sinal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recomendações */}
                  {analysis.recomendacoes && analysis.recomendacoes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-orange-600" />
                        Recomendações
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recomendacoes.map((rec, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-600 font-bold">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Armazenamento */}
                  {analysis.armazenamento && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Thermometer size={20} className="text-purple-600" />
                        Armazenamento
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-700">
                          <span className="font-semibold">Tipo:</span>{' '}
                          <span className="capitalize">{analysis.armazenamento.tipo.replace('_', ' ')}</span>
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold">Temperatura:</span> {analysis.armazenamento.temperatura}
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold">Umidade:</span> {analysis.armazenamento.umidade}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Comercial */}
                  {analysis.comercial && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-600" />
                        Info Comercial
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-700">
                          <span className="font-semibold">Categoria:</span>{' '}
                          <span className="capitalize">{analysis.comercial.categoria}</span>
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold">Adequado venda:</span>{' '}
                          <span className={analysis.comercial.adequadoVenda ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            {analysis.comercial.adequadoVenda ? 'SIM' : 'NÃO'}
                          </span>
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold">Preço:</span> R$ {analysis.comercial.precoSugerido.toFixed(2)}
                        </p>
                        {analysis.comercial.desconto > 0 && (
                          <p className="text-orange-600 font-bold">
                            Desconto: {analysis.comercial.desconto}%
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={clearAnalysis}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white rounded-xl py-3 font-bold transition-all shadow-lg"
                >
                  Nova Análise
                </button>
              </div>
            )}
          </div>

          {/* Painel Lateral - Histórico */}
          <div className="space-y-6">
            {/* Card de Estatísticas */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                Histórico Recente
              </h3>

              {analysisHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Apple size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Nenhuma análise realizada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.result.fruta}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{item.result.fruta}</p>
                          <p className="text-xs text-slate-500 capitalize">{item.result.estado}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {item.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className={`${getStateColors(item.result.estado).badge} text-white px-2 py-1 rounded-lg text-xs font-bold h-fit`}>
                          {item.result.diasValidade}d
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-3">Como funciona?</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>✓ IA analisa cor, textura e estado</li>
                <li>✓ Estima dias de validade</li>
                <li>✓ Fornece recomendações</li>
                <li>✓ Sugere preços e descontos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitAnalysisPage;