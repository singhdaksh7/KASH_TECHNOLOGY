export interface StoredObject { key: string; publicUrl: string }
export interface StorageProvider {
  upload(input: { key: string; body: Buffer; mimeType: string }): Promise<StoredObject>;
  read(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  replace(oldKey: string, input: { key: string; body: Buffer; mimeType: string }): Promise<StoredObject>;
  getPublicUrl(key: string): string;
}
