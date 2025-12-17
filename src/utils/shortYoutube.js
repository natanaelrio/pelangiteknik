const ShortsYoutube = ({ id }) => {
    return (
        <>
            <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`}
                title="YouTube Shorts player"
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                width={500}
                height={700}
            ></iframe>
        </>
    );
}

export default ShortsYoutube;