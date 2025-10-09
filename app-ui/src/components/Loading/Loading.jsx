const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-purple-900/70 flex flex-col items-center py-10 text-neutral-400 rounded-lg max-w-xl w-full'>
        <i className='text-5xl fa-solid fa-spinner mb-6 animate-spin'></i>
        <p className='txt-preset-4 animate-pulse'>Loading ...</p>
      </div>
    </div>
  );
};

export default Loading;
