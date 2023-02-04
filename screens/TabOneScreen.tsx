import { StyleSheet } from 'react-native';
import {useQuery} from '@apollo/client'
import EditScreenInfo from '../components/EditScreenInfo';
import {ActivityIndicator, FlatList} from 'react-native' 
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {SearchBooksQuery} from '../apollo/queries/SearchBooks'
import BookItem from '../components/BookItem';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
	
  const {data, loading, error} = useQuery(SearchBooksQuery,{
			variables: {q: "React Native"},
		})

  
  const renderItem = ({item})=>{
    return (
      <BookItem
        book={{
          title: item.volumeInfo.title,
          image: item.volumeInfo.imageLinks?.thumbnail,
          authors: item.volumeInfo.authors,
          isbn: item.volumeInfo.industryIdentifiers[0].identifier,
        }}
      />
    )
  }
	console.log(JSON.stringify(data,null, 2))
  return (
    <View style={styles.container}>
		  {loading && <ActivityIndicator />}
		  {error &&(
			  <View style={styles.container}>
			    <Text style={styles.title}>Error fetching books</Text>
			    <Text>{error.message}</Text>
			  </View>
	  	)}
    <FlatList 
      data={data?.googleBooksSearch?.items || []}
      renderItem={renderItem as any}
      showsVerticalScrollIndicator={false}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
