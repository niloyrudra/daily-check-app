import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import { BASE_URL } from '@/utils';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActivityIndicatorComponent from '../ActivityIndicatorComponent';

interface VideoPlayerProps {
  linkType: "instruction" | "registration"
}

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({linkType}) => {
  // const videoRef = React.useRef<Video>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
  let isMounted = true;

  const fetchVideoUrl = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/get-${linkType}-video`);
      const data = await response.json();
      if (isMounted && data.url) setVideoUrl(data.url);
    } catch (err) {
      if (isMounted) setError('Unable to load video');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchVideoUrl();

  return () => {
    isMounted = false;
  };
}, [linkType]);


  const player = useVideoPlayer(videoUrl, player => {
    if (!player) return;
    player.loop = false;
    // player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });


  if (loading) {
    return (
    <View style={styles.container}>
      <ActivityIndicatorComponent />
      <Text style={{ color: Theme.accent, fontSize: SIZES.contentText, marginVertical: 20 }}>Loading video...</Text>
    </View>
    );
  }

  if (error || !videoUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Unknown error occurred'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} nativeControls={true} allowsFullscreen allowsPictureInPicture />
    </View>
  );
};

export default VideoPlayerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.screenBodyWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  },
  video: {
    width: SIZES.screenBodyWidth,
    height: (SIZES.screenBodyWidth) * 0.7,
    borderRadius: 12,
    backgroundColor: Theme.primary,
  },
  errorText: {
    color: '#fff',
    fontSize: SIZES.contentText,
    textAlign: 'center',
  },
});