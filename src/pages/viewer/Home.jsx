import styles from "./Home.module.css"
import Input from "../../components/forms/Input";
import { SearchIcon } from "lucide-react";

const Home = ({

}) => {
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
                    asd
                </div>
            </section>
        </>
    )
}

export default Home;