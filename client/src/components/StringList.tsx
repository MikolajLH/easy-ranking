
export default function StringList({ isOrdered, elements }: { isOrdered: boolean, elements: string[] }) {
    return isOrdered ? (
        <ol className="list-group list-group-numbered">
            {elements.map((item, i) => (
                <li
                    key={i}
                    className="list-group-item">{item}</li>
            ))}
        </ol>) : (
        <ul className="list-group">
            {elements.map((item, i) => (
                <li
                    key={i}
                    className="list-group-item">{item}</li>
            ))}
        </ul>)
}