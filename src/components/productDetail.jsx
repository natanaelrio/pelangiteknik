export default function ProductDetail({ data }) {

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: data }} />
        </>
    );
}
