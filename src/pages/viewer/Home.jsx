import styles from "./Home.module.css"
import Input from "../../components/forms/Input";
import { SearchIcon } from "lucide-react";
import { useSections } from "@src/hooks/useSections";
import Button from "@src/components/forms/Button";
import { StorageImage } from "@aws-amplify/ui-react-storage";

const Home = ({

}) => {

    const { sections } = useSections();
    console.log(sections);

    return (
        <>
            <section className={`flex items-center justify-center ${styles.banner} px-5`}>
                <div className="w-full text-center">
                    <h1 className="text-white text-2xl md:text-5xl">Que Información buscas hoy?</h1>
                    <div className="mt-5 md:mt-[3%]">
                        <Input
                            className={`${styles.searchContainer} justify-center`}
                            inputClassContainer={`rounded-lg w-full ${styles.inputClassContainer}`}
                            icon={<SearchIcon className="w-5 h-5 text-red-500" />}
                            iconPosition="right"
                        />
                    </div>
                    <div className="mt-5 flex justify-center gap-4 flex-wrap">
                        {sections.map((section, j) => (
                            <Button
                                key={j}
                                variant="dark"
                                className="hover:bg-red-600"
                            >
                                {section.icon && (
                                    <div className="w-5 flex">
                                        <StorageImage alt="sleepy-cat" path={section.icon} className="rounded-[50%!important]" style={{
                                            mixBlendMode: 'difference'
                                        }} />
                                    </div>
                                )}
                                <span className="font-medium" style={{
                                    mixBlendMode: 'difference'
                                }}>{section.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;