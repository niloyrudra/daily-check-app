import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import { BASE_URL } from '@/utils';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActivityIndicatorComponent from '../ActivityIndicatorComponent';

const RegistrationTutorial: React.FC = () => {
  // const videoRef = React.useRef<Video>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        // Simulate an API fetch
        const response = await fetch(`${BASE_URL}/api/get-registration-video`);
        if (!response.ok) throw new Error('Failed to fetch video URL');

        const data = await response.json();

        console.log(data)

        if (!data.url || typeof data.url !== 'string') {
          throw new Error('Invalid video URL format');
        }

        setVideoUrl(data.url);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Unable to load the video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, []);

  const player = useVideoPlayer(videoUrl, player => {
    player.loop = false;
    // player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });


  if (loading) {
    return (<ActivityIndicatorComponent/>);
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

export default RegistrationTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.screenBodyWidth,
    // backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 12,
    marginVertical: 30
  },
  video: {
    width: SIZES.screenBodyWidth,
    // height: (SIZES.screenBodyWidth) * (9 / 16),
    height: (SIZES.screenBodyWidth) * 0.7,
    borderRadius: 12,
    backgroundColor: Theme.primary,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});