import { motion } from "framer-motion";
import preview2 from "../../../public/images/preview2.jpeg";
import preview1 from "../../../public/images/preview1.jpeg";
import preview3 from "../../../public/images/preview3.jpeg";

export default function VideoPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 overflow-hidden">
      <div className="relative flex flex-col items-center">

        <motion.img
          src={preview2}
          alt="preview2"
          className="z-30 h-36 w-44 rounded-2xl object-cover shadow-xl"
        />

        <motion.img
          src={preview1}
          alt="preview1"
          className="-mt-4 z-20 h-36 w-64 rounded-2xl object-cover shadow-xl"
        />

        <motion.img
          src={preview3}
          alt="preview3"
          className="-mt-4 z-10 h-56 w-[330px] rounded-3xl object-cover shadow-2xl"
        />

        {/* <p className="mt-10 max-w-sm text-center text-2xl font-semibold text-slate-600">
          Select study material to create your own Explainer Video
        </p> */}

             <div className="mt-8 text-center">
          <p className="text-3xl font-semibold text-slate-700">
            Select study material to create
          </p>
        
        </div>


      </div>
    </div>
  );
}