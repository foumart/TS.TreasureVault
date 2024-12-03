import { Assets, Texture } from 'pixi.js';

const assetContext = require.context('/assets', true, /\.(png|jpe?g)$/);

const textures: { [key: string]: Texture } = {};

/**
* Preloads assets and stores them in the textures object.
* The textures can be retrieved with the getTexture(key) method.
*/
export async function preloadAssets() {
    const assetPromises = assetContext.keys().map(async key => {
        const assetPath = key.replace('./', '/assets/');
        const texture = await Assets.load(assetPath);

        // Store the texture in the textures object with the asset name as the key
        textures[getAssetNames(key)] = texture;
    });

    await Promise.all(assetPromises);
}

/**
* Extracts the asset name from the file path.
* @param assetPath - The path of the asset file.
* @returns The name of the asset without the file extension.
*/
function getAssetNames(assetPath: string): string {
    return assetPath.split('/').pop()?.split('.')[0] || '';
}

/**
* Retrieves a texture by its key.
* @param key - The key of the texture to retrieve.
* @returns The texture associated with the given key, or undefined if not found.
*/
export function getTexture(key: string): Texture | undefined {
    return textures[key];
}