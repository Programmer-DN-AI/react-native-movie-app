import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
  
  import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/usefetch";
  
  interface MovieInfoProps {
    label: string;
    value?: string | number | null;
  }
  
  const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
  
  const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoRef, setVideoRef] = useState<Video | null>(null);

    const { data: movie, loading } = useFetch(() =>
      fetchMovieDetails(id as string)
    );

    const handlePlayVideo = () => {
      setIsVideoPlaying(true);
    };

    const handleVideoEnd = () => {
      setIsVideoPlaying(false);
    };

    const handleVideoError = (error: any) => {
      console.log("Video error:", error);
    };

    if (loading)
      return (
        <SafeAreaView className="bg-primary flex-1">
          <ActivityIndicator />
        </SafeAreaView>
      );

    return (
      <View className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View>
            {isVideoPlaying ? (
              <View className="w-full h-[550px] bg-black">
                <Video
                  ref={setVideoRef}
                  source={{ 
                    uri: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
                  }}
                  className="w-full h-full"
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  isLooping={false}
                  shouldPlay={true}
                  onError={handleVideoError}
                  onPlaybackStatusUpdate={(status) => {
                    console.log("Video status:", status);
                    if (status.isLoaded && status.didJustFinish) {
                      handleVideoEnd();
                    }
                  }}
                />
                <TouchableOpacity 
                  className="absolute top-4 right-4 bg-black/50 rounded-full size-10 flex items-center justify-center"
                  onPress={() => setIsVideoPlaying(false)}
                >
                  <Text className="text-white text-xl">×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                className="w-full h-[550px]"
                resizeMode="stretch"
              />
            )}

            {!isVideoPlaying && (
              <TouchableOpacity 
                className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
                onPress={handlePlayVideo}
              >
                <Image
                  source={icons.play}
                  className="w-6 h-7 ml-1"
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            )}
          </View>
  
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movie?.release_date?.split("-")[0]} •
              </Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            </View>
  
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
  
              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
  
              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>
  
            <MovieInfo label="Overview" value={movie?.overview} />
            <MovieInfo
              label="Genres"
              value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
            />
  
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(
                  (movie?.revenue ?? 0) / 1_000_000
                )} million`}
              />
            </View>
  
            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies?.map((c) => c.name).join(" • ") ||
                "N/A"
              }
            />
          </View>
        </ScrollView>
  
        <TouchableOpacity
          className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default Details;