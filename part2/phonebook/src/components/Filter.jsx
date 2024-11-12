const Filter = ({ filter, onChange }) => {
    return (
        <div>
            filter shown with <input type="text" value={filter} onChange={onChange} />
        </div>
    );
}

export default Filter;