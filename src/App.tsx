import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const url = "https://api.telegram.org/bot7374565657:AAHltUNRTPeA0DiHoxT_4BCEappAGJ5htHg/";
  const [fileIdArray, setFileIdArray] = useState<string[]>([]);
  const [imageArray, setImageArray] = useState<string[]>([]);
  // const [user, setUser] = useState(null);


  const getUpdates = async() => {
      try{
        // Get the updates from Telegram API
        const response = await fetch(url + "getUpdates");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json.result)
        return json.result
      }catch (error){
        console.log(`Error in getUpdates function: ${error}`)
      }
  }

  const getFileIds = async(result:any[]) => {
    try {
      // Add unique file_ids to fileIdArray
      const newFileIds: string[] = [];
      for (let i = 0; i < result.length; i++) {
        var photo = result[i].message.photo
        const fileId = photo[photo.length - 1].file_id;
        if (!fileIdArray.includes(fileId) && !newFileIds.includes(fileId)) {
          newFileIds.push(fileId);
        }
      }
      setFileIdArray((prevFileIdArray) => [...prevFileIdArray, ...newFileIds]);
    } catch (error) {
      console.log(`Error in getFileIds function: ${error}`)
    }
  }

  const setImages = async() => {
    try {
      // Fetch file details using file_ids
      const newImages: string[] = [];
      for (let i = 0 ; i < fileIdArray.length ; i++) {
        const fileResponse = await fetch(`${url}getFile?file_id=${fileIdArray[i]}`);
        const fileJson = await fileResponse.json();
        const filePath = fileJson.result.file_path;
        newImages.push(`https://vsnbrd-fastapi-addidras-projects.vercel.app/getImage?file_path=${filePath}`);
      }
      setImageArray((prevImageArray) => [...prevImageArray, ...newImages]);
    } catch (error) {
      console.log(`Error in setImages function: ${error}`)
    }
  }
  // Fetch images
  const fetchImage = async () => {
    try {
      let result = await getUpdates()
      await getFileIds(result)
      await setImages()
    } catch (error:any) {
      console.error("Error fetching images:", error.message);
    }
  };

  // Log the updated image array for debugging purposes
  useEffect(() => {
    console.log(fileIdArray)
    console.log("Image Array:", imageArray);
  }, [imageArray]);

  useEffect(()=>{
    console.log(window)
  },[])

  return (
    <div>
      <button onClick={fetchImage}>
        Fetch Images
      </button>
      <div>
        {imageArray.length > 0 ? (
          imageArray.map((img, index) => (
            <img key={index} src={img} width={250} height={250} alt={`image-${index}`} />
          ))
        ) : (
          <p>No images to display</p>
        )}
      </div>
    </div>
  );
}


export default App
