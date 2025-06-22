// src/components/VideoDetails.jsx
const VideoDetails = ({ thumbnail, title, hashtags, duration }) => (
  <div className="video-details bg-white shadow rounded-lg p-4 flex gap-4 items-start">
    <img
      src={thumbnail}
      alt={`Thumbnail for ${title}`}
      className="w-40 h-auto rounded-md object-cover"
    />
    <div className="flex flex-col gap-1">
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      {hashtags && (
        <p className="text-sm text-blue-600 break-words">{hashtags}</p>
      )}
      <p className="text-sm text-gray-600">Duration: {duration}</p>
    </div>
  </div>
);

export default VideoDetails;
