import { useEffect, useState } from 'react'
import WebApp from "@twa-dev/sdk"
import './App.css'
// import TelegramLogin from './components/TelegramLogin';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

function App() {
  const backend = "https://vsnbrd-fastapi-addidras-projects.vercel.app/";
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [user, setUser] = useState<UserData|null>(null);

  useEffect(() => {
      if (WebApp.initDataUnsafe.user) {
        setUser(WebApp.initDataUnsafe.user as UserData)
      }
  }, []);


  const getFilePaths = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${backend}getFilePaths?user_id=${user?.id}`);
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
    if (imageArray.length){console.log("Image Array:", imageArray);}
  }, [imageArray]);

  return (
    <div>
      {
        user ? 
        (<>
          <h1>User Data:</h1>
          <ul>
            <li>{user.id}</li>
            <li>{user.first_name}</li>
            <li>{user.last_name}</li>
            <li>{user.username}</li>
            <li>{user.language_code}</li>
          </ul>
        </>):
        (<h5>user doesnt exist</h5>)
      }
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
