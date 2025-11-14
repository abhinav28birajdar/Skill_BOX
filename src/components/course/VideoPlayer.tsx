import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, onComplete }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(value * duration);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000000',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={ResizeMode.CONTAIN}
        onLoad={(status) => {
          setIsLoading(false);
          setDuration((status as any).durationMillis || 0);
        }}
        onPlaybackStatusUpdate={(status: any) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);

            if (status.didJustFinish) {
              onComplete?.();
            }
          }
        }}
      />

      {/* Loading */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {/* Controls */}
      {!isLoading && showControls && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            style={{
              alignSelf: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={50}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 2,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${(position / duration) * 100}%`,
                  backgroundColor: '#007AFF',
                  borderRadius: 2,
                }}
              />
            </View>
          </View>

          {/* Time */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              {formatTime(position)}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      )}

      {/* Tap to toggle controls */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
};
