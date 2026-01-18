import { useEffect, useRef } from "react";

export default function useWhyDidYouRender(name, values) {
    const previous = useRef(values);

    useEffect(() => {
        const changed = {};

        Object.keys(values).forEach(key => {
            if (!Object.is(previous.current[key], values[key])) {
                changed[key] = {
                    before: previous.current[key],
                    after: values[key]
                };
            }
        });

        if (Object.keys(changed).length > 0) {
            console.log(`🔍 [WHY RENDER] ${name}`, changed);
        }

        previous.current = values;
    });
}
