class VideoPreloader {
  private preloadedVideos = new Map<string, boolean>();
  private loadingQueue: string[] = [];
  private isProcessing = false;
  private batchSize = 4;

  async preloadBatch(urls: string[]): Promise<void> {
    this.loadingQueue.push(...urls.filter(url => !this.preloadedVideos.has(url)));

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.loadingQueue.length > 0) {
      const batch = this.loadingQueue.splice(0, this.batchSize);
      await Promise.all(batch.map(url => this.preloadVideo(url)));
    }

    this.isProcessing = false;
  }

  private preloadVideo(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.preloadedVideos.has(url)) {
        resolve();
        return;
      }

      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      const handleCanPlay = () => {
        this.preloadedVideos.set(url, true);
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();
        resolve();
      };

      const cleanup = () => {
        video.removeEventListener('canplaythrough', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.remove();
      };

      video.addEventListener('canplaythrough', handleCanPlay);
      video.addEventListener('error', handleError);

      video.load();
    });
  }

  isPreloaded(url: string): boolean {
    return this.preloadedVideos.has(url);
  }

  reset(): void {
    this.preloadedVideos.clear();
    this.loadingQueue = [];
    this.isProcessing = false;
  }
}

export const videoPreloader = new VideoPreloader();
