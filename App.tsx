import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const API_KEY =
    "trespontas::stepzen.net+1000::b5598e693bac1c8114bc3d051f5fbab37d6549ccfd77b34a41aa027e228cd2ad";
  const client = new ApolloClient({
    uri: "https://trespontas.stepzen.net/api/toned-wolf/__graphql",
    headers: { Authorization: `Apikey ${API_KEY}` },
    cache: new InMemoryCache(),
  });

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}
