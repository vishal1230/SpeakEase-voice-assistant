export interface AudioChunk {
  data: Float32Array;
  timestamp: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  timestamp: number;
}

export interface TTSResult {
  audioBuffer: AudioBuffer;
  duration: number;
}

export interface LatencyMetrics {
  sttLatency: number;
  apiLatency: number;
  ttsLatency: number;
  totalLatency: number;
}
