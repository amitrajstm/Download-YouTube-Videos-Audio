const VideoDetails = ({ thumbnail, title, hashtags, duration }) => (
  <div className="video-details">
    <img src={thumbnail} alt="Thumbnail" />
    <p className="title">{title}</p>
    <p className="hashtags">{hashtags}</p>
    <p className="duration">Duration: {duration}</p>
  </div>
);

export default VideoDetails;
