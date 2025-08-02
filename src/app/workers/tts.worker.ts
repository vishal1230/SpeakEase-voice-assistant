// Fix the window reference issue
self.onmessage = async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'INIT':
      try {
        self.postMessage({ type: 'INITIALIZED' });
      } catch (error) {
        self.postMessage({ 
          type: 'ERROR', 
          data: { message: 'Failed to initialize TTS' } 
        });
      }
      break;

    case 'SYNTHESIZE':
      try {
        // Simulate synthesis delay
        setTimeout(() => {
          self.postMessage({
            type: 'SYNTHESIS_COMPLETE',
            data: {
              text: data.text,
              duration: 1000
            }
          });
        }, 500);
      } catch (error) {
        self.postMessage({ 
          type: 'ERROR', 
          data: { message: 'Failed to synthesize' } 
        });
      }
      break;
  }
};

export {}; // Make it a module
