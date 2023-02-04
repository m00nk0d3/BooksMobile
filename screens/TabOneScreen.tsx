import { Button, Pressable, StyleSheet } from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/client'
import EditScreenInfo from '../components/EditScreenInfo';
import {ActivityIndicator, FlatList, TextInput} from 'react-native' 
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {SearchBooksQuery} from '../apollo/queries/SearchBooks'
import BookItem from '../components/BookItem';
import { useState } from 'react';

type Book = {
  title:string,
  image: string,
  authors: string[],
  isbn:string
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [search, setSearch] = useState<string>('')
  const [provider, setProvider] = useState<"googleBooksSearch" | "openLibrarySearch">("googleBooksSearch")
	
  const [runQuery,{data, loading, error}] = useLazyQuery(SearchBooksQuery,{
			variables: {q: search},
		})

  const parseBook = (item):Book => {
    if(provider === "googleBooksSearch"){
      return {
        title: item.volumeInfo.title,
        image: item.volumeInfo.imageLinks?.thumbnail,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      }
    }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn?.[0],
    }
  }
  
  const renderItem = ({item})=>{
    return (
      <BookItem
        book={parseBook(item)}
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
      <View style={styles.tabs}>
        <Pressable onPress={()=>setProvider("googleBooksSearch")}>

        <Text style={provider==="googleBooksSearch"?{fontWeight: "bold", color:"royalblue"}:{}}>Google Books</Text>
        </Pressable>
        <Pressable onPress={()=>setProvider("openLibrarySearch")}>

        <Text style={provider==="openLibrarySearch"?{fontWeight: "bold", color:"royalblue"}:{}} >Open Library</Text>
        </Pressable>
      </View>
		  {loading && <ActivityIndicator />}
		  {error &&(
			  <View style={styles.container}>
			    <Text style={styles.title}>Error fetching books</Text>
			    <Text>{error.message}</Text>
			  </View>
	  	)}
    <FlatList 
      data={(provider === "googleBooksSearch"? data?.googleBooksSearch?.items : data?.openLibrarySearch?.docs) || []}
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
  tabs: {
    flexDirection: 'row',
    justifyContent: "space-around",
    height: 50,
    alignItems:"center"
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
