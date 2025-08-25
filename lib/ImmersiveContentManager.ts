import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import { BIOMETRIC_CONFIG } from '../config/bioCognitiveConfig';

export interface SpatialAudioSource {
  uri: string;
  position: THREE.Vector3;
  sound?: Audio.Sound;
}

export interface HapticPattern {
  intensity: number;
  duration: number;
}

export class ImmersiveContentManager {
  private gl: ExpoWebGLRenderingContext | null = null;
  private renderer: Renderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private scene: THREE.Scene | null = null;
  private audioSources: Map<string, SpatialAudioSource> = new Map();
  private isInitialized = false;

  constructor() {
    this.setupAudio();
  }

  private async setupAudio() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
    });
  }

  public async initialize(glContext: ExpoWebGLRenderingContext) {
    if (this.isInitialized) return;

    this.gl = glContext;
    this.renderer = new Renderer({ gl: this.gl });
    this.scene = new THREE.Scene();
    
    // Setup camera
    const { drawingBufferWidth: width, drawingBufferHeight: height } = this.gl;
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    this.camera.position.z = 5;

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.isInitialized = true;
  }

  public async loadModel(uri: string): Promise<THREE.Object3D> {
    const asset = await Asset.fromURI(uri);
    // Implementation would depend on file type (glTF, OBJ, etc.)
    // This is a placeholder that creates a basic cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  public async loadTexture(uri: string): Promise<THREE.Texture> {
    const asset = await Asset.fromURI(uri);
    const texture = await new TextureLoader().loadAsync(asset);
    return texture;
  }

  public async addSpatialAudio(source: SpatialAudioSource) {
    const { sound } = await Audio.Sound.createAsync(
      { uri: source.uri },
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
        rate: 1.0,
        shouldCorrectPitch: true,
      }
    );

    this.audioSources.set(source.uri, {
      ...source,
      sound,
    });

    await this.updateAudioPositions();
  }

  private async updateAudioPositions() {
    if (!this.camera) return;

    for (const [_, source] of this.audioSources) {
      if (!source.sound) continue;

      const distance = this.camera.position.distanceTo(
        new THREE.Vector3(source.position.x, source.position.y, source.position.z)
      );

      // Simple distance-based attenuation
      const maxDistance = BIOMETRIC_CONFIG.IMMERSIVE_CONTENT.SPATIAL_AUDIO.ROLLOFF_FACTOR;
      const volume = Math.max(0, 1 - (distance / maxDistance));
      
      await source.sound.setVolumeAsync(volume);
    }
  }

  public async playHapticPattern(pattern: HapticPattern[]) {
    for (const step of pattern) {
      if (step.intensity >= 0.8) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (step.intensity >= 0.5) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }

  public render() {
    if (!this.isInitialized || !this.renderer || !this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  public updateCameraPosition(position: THREE.Vector3) {
    if (!this.camera) return;
    this.camera.position.copy(position);
    this.updateAudioPositions();
  }

  public resize(width: number, height: number) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    // Clean up resources
    this.audioSources.forEach(async (source) => {
      if (source.sound) {
        await source.sound.unloadAsync();
      }
    });
    this.audioSources.clear();

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gl = null;
    this.isInitialized = false;
  }
}
