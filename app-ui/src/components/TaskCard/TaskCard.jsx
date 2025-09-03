import { getImageUrl } from '../../utils/image-utils';

const TaskCard = () => {
  return (
    <div className="mb-[24px] border border-yellow-400">
      <img src={getImageUrl('icon-play.svg')} alt="" />
      <div>
        <div>
          <h5>Work</h5>
          <i className="text-white fa-solid fa-ellipsis"></i>
        </div>
        <p>5hrs</p>
        <p>Previous - 7hrs</p>
      </div>
    </div>
  );
};

export default TaskCard;

// Work
//   5hrs <!-- daily -->
//   Previous - 7hrs <!-- daily -->
//   32hrs <!-- weekly -->
//   Previous - 36hrs <!-- weekly -->
//   103hrs <!-- monthly -->
//   Previous - 128hrs <!-- monthly -->

