interface MasterTopicCardProps {
  title: string;
  subtitle: string;
  thumbnail: string;
}

const MasterTopicCard = ({
  title,
  subtitle,
  thumbnail,
}: MasterTopicCardProps) => {
  return (
    <div className="group flex cursor-pointer gap-4 rounded-xl p-1 transition hover:bg-gray-50">
      <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-[#EEF1FF]">
        <img
          src={thumbnail}
          alt={title}
          className="w-32 h-24 rounded-xl object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center">
        <h4 className="line-clamp-2 text-base font-semibold leading-6 text-black">
          {title}
        </h4>

        <p className="mt-2 text-sm text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default MasterTopicCard;