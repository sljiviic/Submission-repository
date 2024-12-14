const Search = ({ id, text, value, onChange }) => {
    return (
        <div>
            <label htmlFor={id}>{text}</label>
            <input type="text" id={id} value={value} onChange={onChange} />
        </div>
    );
}

export default Search;