import classes from "./App.module.scss";
import FilePlace from "./components/filePlace/FilePlace";
import ResultsPlace from "./components/resultsPlace/ResultsPlace";

function App() {
    return (
        <>
            <main className={classes.main}>
                <h1 className={classes.title}>
                    Intelligent OCR Data Extraction Platform
                </h1>
                <ul className={classes.details}>
                    <li className={classes.par}>
                        Upload an image or PDF of an Israeli government document to extract structured data using OCR and AI.
                    </li>
                    <li className={classes.par}>
                        ⚠️ Ensure the document is clear and fully visible. Poor quality images may not process correctly.
                    </li>
                    <li className={classes.par}>
                        After processing, you'll receive a structured JSON with key fields, or an error if the file is unclear.
                    </li>
                </ul>
                <div className={classes.content}>
                    <ResultsPlace />
                    <FilePlace />
                </div>
            </main>
        </>
    );
}

export default App;
