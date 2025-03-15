import { useEffect, useState } from 'react'
import './App.css'
import TelegramLogin from './components/TelegramLogin';

function App() {
  const backend = "https://vsnbrd-fastapi-addidras-projects.vercel.app/";
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ensure Telegram WebApp object is available
    if (window.Telegram?.WebApp) {
      const initDataString = window.Telegram.WebApp.initData
      if(initDataString) {
        const urlParams = new URLSearchParams(initDataString);
        try {
          const user = JSON.parse(urlParams.get("user") || '{}')
          if (user.id) {
            setUser(user.id.toString());
          }
        } catch (error) {
          setUser(`ERROR: ${error}`)
        }
      }
      // const userData = window.Telegram.WebApp.initDataUnsafe.user;
      // console.log("User Data:", userData,user);
      // setUser(userData);
    }else{
      setUser("No User")
    }
  }, []);


  const getFilePaths = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${backend}getFilePaths`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const filePaths: string[] = await response.json(); // Parse JSON response
        console.log(filePaths);
        return filePaths;
    } catch (error) {
        console.error("Error with getFilePaths:", error);
        return []; // Return an empty array to prevent undefined errors
    }
  };


  const setImages = async(filePaths: string[]) => {
    try {
      // Fetch file details using file_ids
      const newImages: string[] = [];
      for (let i = 0 ; i < filePaths.length ; i++) {
        newImages.push(`${backend}/getImage?file_path=${filePaths[i]}`);
      }
      setImageArray((prevImageArray) => [...prevImageArray, ...newImages]);
    } catch (error) {
      console.log(`Error in setImages function: ${error}`)
    }
  }

  const fetchImage = async () => {
    try {
      let file_paths:string[] = await getFilePaths()
      setImages(file_paths)
    } catch (error:any) {
      console.error("Error fetching images:", error.message);
    }
  };

  // Log the updated image array for debugging purposes
  useEffect(() => {
    console.log("Image Array:", imageArray);
  }, [imageArray]);

  return (
    <div>
      <TelegramLogin/>
      <h1>This is the user logged in: { user }</h1>
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
