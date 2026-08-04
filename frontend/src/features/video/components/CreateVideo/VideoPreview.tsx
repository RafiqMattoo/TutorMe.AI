import { motion } from "framer-motion";
import preview2 from "../../../../public/images/preview2.jpeg";
import preview1 from "../../../../public/images/preview1.jpeg";
import preview3 from "../../../../public/images/preview3.jpeg";

export default function VideoPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-slate-50">
      <div className="relative flex flex-col items-center">

        {/* Top Card */}
        <motion.img
          src={preview2}
          alt="preview2"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="z-30 h-28 w-36 rounded-2xl object-cover shadow-lg"
        />

        {/* Middle Card */}
        <motion.img
          src={preview1}
          alt="preview1"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="-mt-2 z-20 h-28 w-52 rounded-2xl object-cover shadow-lg"
        />

        {/* Bottom Card */}
        <motion.img
          src={preview3}
          alt="preview3"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="-mt-2 z-10 h-44 w-[280px] rounded-3xl object-cover shadow-xl"
        />

        {/* Text */}
        <div className="mt-6 text-center">
          <p className="text-xl font-medium leading-7 text-slate-700">
            Select study material
            <br />
            to create
          </p>
        </div>

      </div>
    </div>
  );
}