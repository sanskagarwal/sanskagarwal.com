import { List } from "react-content-loader";

const Loading = () => (
    <div className="grid grid-cols-6">
        <div
            className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                shadow-2xl md:shadow-lg"
        >
            <List />
            <br />
            <List />
        </div>
    </div>
);

export default Loading;
