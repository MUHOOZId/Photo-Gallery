import React, {useState,useEffect} from 'react';
import { FileUploader,Collection, Image } from '@aws-amplify/ui-react';
import {Storage} from "aws-amplify" // manually list
import '@aws-amplify/ui-react/styles.css';
import { S3ProviderListOutputItem } from '@aws-amplify/storage'; // Adjust the path as needed


import './App.css';

function App() {
const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>([]);
const [images, setImages] = useState<string[]>([]);

const fetchImages = async() =>{
  const {results} = await Storage.list("",{level:"public"});

  const s3Images = await Promise.all(
    results.map(
      async image => await Storage.get(image.key!, {level: "public"})
     
    )
    
  );
 
  setImages(s3Images);
  setImageKeys(results);
};


useEffect(() => {
  fetchImages();
}, []);

const onSuccess = (event: {key: string}) =>{
fetchImages();
};



  return ( 
  <>
  <FileUploader
accessLevel="public"
acceptedFileTypes={["image/*"]}
variation='drop'
onSuccess={onSuccess}
/>
<Collection
items = {images}
type = "grid"
padding="2rem"
boxShadow = "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
maxWidth ="1100px"
margin ="0 auto"
justifyContent ="center"
templateColumns = {{
  base: "minimax(0, 500px)",
  medium: "repeat(2,minmax(0,1fr))",
  large: "repeat(3, minmax(0,1fr))"
}}
gap= "small"
>
{(item, index) => (
  <div key={index}>
  <Image src={item} alt=""/>
 
  </div>
  )}
</Collection>
  </>
  );

}

export default App;
