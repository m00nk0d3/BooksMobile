import { Button, StyleSheet } from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/client'
import EditScreenInfo from '../components/EditScreenInfo';
import {ActivityIndicator, FlatList, TextInput} from 'react-native' 
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {SearchBooksQuery} from '../apollo/queries/SearchBooks'
import BookItem from '../components/BookItem';
import { useState } from 'react';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [search, setSearch] = useState<string>('')
	
  const [runQuery,{data, loading, error}] = useLazyQuery(SearchBooksQuery,{
			variables: {q: search},
		})

  
  const renderItem = ({item})=>{
    return (
      <BookItem
        book={{
          title: item.volumeInfo.title,
          image: item.volumeInfo.imageLinks?.thumbnail,
          authors: item.volumeInfo.authors,
          isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
        }}
      />
    )
  }
	console.log(JSON.stringify(data,null, 2))
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
        style={styles.input} 
        placeholder='Search'
        onChangeText={setSearch}
        value={search}
        />
        <Button 
          title='Search' 
          onPress={()=> runQuery({variables: {q:search}})}
          />
      </View>
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
  header:{
    flexDirection:"row",  
    alignItems:'center'
  },
  input:{
    flex: 1,
    borderWidth:1,
    borderRadius: 40,
    borderColor: "gainsboro",
    paddingHorizontal:20,
    marginRight: 10,
    marginVertical: 5,

    
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
