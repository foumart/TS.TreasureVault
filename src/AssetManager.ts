import { Assets, Texture } from 'pixi.js';

export class AssetManager {

    static instance: AssetManager;

    // Dynamically require all assets in the 'assets/' directory. (Webpack module)
    private assetContext = require.context('/assets', true, /\.(png|jpe?g)$/);

    // A dictionary to store textures with asset names as keys and Texture object values.
    private textures: { [key: string]: Texture } = {};

    /**
    * Singleton pattern implementation
    * @returns the one and only AssetManager instance
    */
    public static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }

        return AssetManager.instance;
    }
    
    /**
    * Preloads assets and stores them in the textures object.
    * The textures can be retrieved with the getTexture method.
    */
    async preloadAssets() {
        const assetPromises = this.assetContext.keys().map(async key => {
            const assetPath = key.replace('./', '/assets/');
            const texture = await Assets.load(assetPath);
        
            // Store the texture in the textures object with the asset name as the key
            this.textures[this.getAssetName(assetPath)] = texture;
        });
    
        await Promise.all(assetPromises);
    }
    
    /**
    * Extracts the asset name from the file path.
    * @param assetPath - The path of the asset file.
    * @returns The name of the asset without the file extension.
    */
    getAssetName(assetPath: string): string {
        return assetPath.split('/').pop()?.split('.')[0] || '';
    }
    
    /**
    * Retrieves a texture by its key.
    * @param key - The key of the texture to retrieve.
    * @returns The texture associated with the given key, or undefined if not found.
    */
    getTexture(key: string): Texture | undefined {
        return this.textures[key];
    }
}