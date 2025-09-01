import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Simplified interfaces for when 3D features are disabled
export interface SpatialAudioSource {
  uri: string;
  position: { x: number; y: number; z: number };
  sound?: Audio.Sound;
}

export interface HapticPattern {
  intensity: number;
  duration: number;
}

export class ImmersiveContentManager {
  private audioSources: Map<string, SpatialAudioSource> = new Map();
  private masterVolume: number = 1.0;

  public async initialize() {
    console.log('ImmersiveContentManager initialized (3D features disabled)');
  }

  public async loadModel(uri: string): Promise<any> {
    console.log('3D model loading disabled');
    return null;
  }

  public async loadTexture(uri: string): Promise<any> {
    console.log('Texture loading disabled');
    return null;
  }

  public async setupSpatialAudio(sources: SpatialAudioSource[]) {
    for (const source of sources) {
      const asset = Asset.fromURI(source.uri);
      await asset.downloadAsync();
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: asset.localUri || source.uri },
        { 
          shouldPlay: false,
          volume: this.masterVolume,
          isLooping: false
        }
      );

      source.sound = sound;
      this.audioSources.set(source.uri, source);
    }
  }

  public async playSpatialAudio(sourceUri: string) {
    const source = this.audioSources.get(sourceUri);
    if (source?.sound) {
      await source.sound.playAsync();
    }
  }

  public async stopSpatialAudio(sourceUri: string) {
    const source = this.audioSources.get(sourceUri);
    if (source?.sound) {
      await source.sound.stopAsync();
    }
  }

  public updateCameraPosition(position: { x: number; y: number; z: number }) {
    console.log('Camera position update disabled');
  }

  public async renderFrame() {
    console.log('3D rendering disabled');
  }

  public async performHapticFeedback(pattern: HapticPattern) {
    const impacts = Math.floor(pattern.duration / 100);
    for (let i = 0; i < impacts; i++) {
      await Haptics.impactAsync(
        pattern.intensity > 0.7 
          ? Haptics.ImpactFeedbackStyle.Heavy
          : pattern.intensity > 0.4 
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
      if (i < impacts - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.audioSources.forEach(async (source) => {
      if (source.sound) {
        await source.sound.setVolumeAsync(this.masterVolume);
      }
    });
  }

  public async cleanup() {
    for (const source of this.audioSources.values()) {
      if (source.sound) {
        await source.sound.unloadAsync();
      }
    }
    this.audioSources.clear();
  }
}
