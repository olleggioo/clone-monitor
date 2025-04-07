import { FC, useState } from "react";
import styles from "./Test.module.scss"
import Row from "./Row";

const VirtualScroll: FC<any> = ({
    rowHeight,
    totalItems,
    items,
    visibleItemsLength,
    containerHeight,
    dropdownItems,
    isLoading,
    required,
    selectedAll,
    whichTable,
}) => {
    // Calculate the total height of the container
    const totalHeight = rowHeight * totalItems;
    //   Current scroll position of the container
    const [scrollTop, setScrollTop] = useState(0);
    // Get the first element to be displayed
    const startNodeElem = Math.ceil(scrollTop / rowHeight);
    // Get the items to be displayed
    const visibleItems = items.slice(
        startNodeElem,
        startNodeElem + visibleItemsLength
    );
    //  Add padding to the empty space
    const offsetY = startNodeElem * rowHeight;

    const handleScroll = (e: any) => {
        // set scrollTop to the current scroll position of the container.
        setScrollTop(e?.currentTarget?.scrollTop);
    };

    return (
        <div
            style={{
                height: containerHeight,
                overflow: "auto",
                border: "5px solid black",
            }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight }}>
                <div 
                // style={{ transform: `translateY(${offsetY}px)` }}
                >
                    {visibleItems.map((item: any, index: any) => (
                        <div key={index}>
                            {/* <p>{`Row Number - ${index}`}</p> */}
                            {/* Render columns */}
                            <div className={styles.something}>
                                     <Row
                                        {...item}
                                        index={index}
                                        length={totalItems}
                                        dropdownItems={dropdownItems}
                                        key={item.id}
                                        userId={item.userId}
                                        isLoading={isLoading}
                                        whichTable={whichTable}
                                        selectedAll={selectedAll}
                                        required={required}
                                    />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VirtualScroll;