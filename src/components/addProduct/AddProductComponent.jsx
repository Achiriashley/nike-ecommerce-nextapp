


// import React from 'react' 
// import {useStoreForm} from '@/store/formVisible.store';
// import Image from "next/image";
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"


// export default function AddProductComponent() {
//   const [imagePreview, setImagePreview] = React.useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const {isFormVisible, closeForm} = useStoreForm();

//   let payLoad ={
//     title,
//     proce,
//     category,
//     image: imagePreview,


//   }
//   return (

//     <div className='flex items-center justify-center h-screen  w-full  flex-col gap-6 fixed top-0 left-2/4 right-2/4 translate-x-[-50%] backdrop-blur-md bg-[#ffffff91] z-50'>
//       <Card className="w-[350px]">
//       <CardHeader>
//         <CardTitle className="text-center">Add products</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" placeholder="Product title" />
//             </div>
            
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="price">Price</Label>
//               <Input id="price" type="number" placeholder="Product price" />
//             </div>

//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="category">Category</Label>
//               <Select>
//                 <SelectTrigger id="category">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent position="popper">
//                   <SelectItem value="electronics">Electronics</SelectItem>
//                   <SelectItem value="clothing">Clothing</SelectItem>
//                   <SelectItem value="shoes">Shoes</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="image">Image</Label>
//               <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
//               {imagePreview && (
//                 <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover mt-2 border rounded" />
//               )}
//             </div>

//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="description">Description</Label>
//               <Input value={description} onChange={(e) } id="description" placeholder="Product description" />
//             </div>

//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="slug">Slug</Label>
//               <Input id="slug" placeholder="Product slug" />
//             </div>
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button onClick={()=>closeForm()} variant="outline">Cancel</Button>
//         <Button onClick={( => createProduct)} className="bg-[#f80] items-center">Add Product</Button>
//       </CardFooter>
//     </Card>
//     </div>
//   )
// }

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStoreForm } from '@/store/formVisible.store'

export default function AddProductComponent() {
    const [imagePreview, setImagePreview] = React.useState(null);
    const [title, setTitle] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [description, setDescription] = React.useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
    const { closeForm } = useStoreForm();
    

    let payload = {
        title,
        price,
        category,
        image: imagePreview,
        description,
        slug
    }

    const createProduct = () => {
        console.log('Payload',payload.title);
    }

  return (
    <div className='flex items-center justify-center   w-full  flex-col gap-6 fixed top-0 left-2/4 right-2/4 translate-x-[-50%] backdrop-blur-md bg-[#ffffff91] z-50'>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Add products</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input value={title} onChange={(e)=>setTitle(e.target.value)} id="title" placeholder="Product title" />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input value={price} onChange={(e)=>setPrice(e.target.value)} id="price" type="number" placeholder="Product price" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setCategory(value)} defaultValue="electronics">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover mt-2 border rounded" />
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input value={description} onChange={(e)=>setDescription(e.target.value)} id="description" placeholder="Product description" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input value={slug} onChange={(e)=>setSlug(e.target.value)} id="slug" placeholder="Product slug" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={()=>closeForm()} variant="outline">Cancel</Button>
        <Button onClick={()=>createProduct()} className="bg-[#f80]">Add Product</Button>
      </CardFooter>
    </Card>
    </div>
  )
}