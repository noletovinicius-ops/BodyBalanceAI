import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const MAX_WIDTH = 900;

/**
 * Abre câmera ou galeria, reduz a foto e a guarda só no aparelho. No celular,
 * fica no diretório privado do app; na web, vira data URI (localStorage).
 */
export async function pickPhoto(source: 'camera' | 'library'): Promise<string | undefined> {
  if (source === 'camera' && Platform.OS !== 'web') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('camera-permission');
  }
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1 };
  const result = source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets[0]) return undefined;

  const asset = result.assets[0];
  const ctx = ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_WIDTH) ctx.resize({ width: MAX_WIDTH });
  const image = await ctx.renderAsync();
  const saved = await image.saveAsync({ compress: 0.7, format: SaveFormat.JPEG, base64: Platform.OS === 'web' });

  if (Platform.OS === 'web') return `data:image/jpeg;base64,${saved.base64}`;

  const dir = new Directory(Paths.document, 'photos');
  if (!dir.exists) dir.create();
  const dest = new File(dir, `${Date.now()}.jpg`);
  new File(saved.uri).copy(dest);
  return dest.uri;
}

export function deleteAllPhotos() {
  if (Platform.OS === 'web') return;
  const dir = new Directory(Paths.document, 'photos');
  if (dir.exists) dir.delete();
}
