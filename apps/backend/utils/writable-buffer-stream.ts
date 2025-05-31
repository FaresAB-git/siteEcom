import { Writable } from 'stream';

export class WritableBufferStream extends Writable {
  private chunks: Buffer[] = [];

  _write(chunk: any, encoding: BufferEncoding, callback: () => void) {

    const bufferChunk = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk as string, encoding);
    this.chunks.push(bufferChunk);
    callback();
  }

  getBuffer(): Promise<Buffer> {
    return new Promise((resolve) => {
      this.on('finish', () => {
        resolve(Buffer.concat(this.chunks));
      });
    });
  }
}
