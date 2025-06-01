import { useEffect } from "react";
import classes from "./ResultsPlace.module.scss";
import Loader from "../loader/Loader";
import { useAppContext } from "../../store/AppContext";

const ResultsPlace = () => {
    const { results, setParsedResults, loading, parsedResults, error } =
        useAppContext();

    useEffect(() => {
        if (!error) {
            setParsedResults(JSON.stringify(results, null, 4));
        }
    }, [results, setParsedResults, error]);

    return (
        <div className={classes.resultsPlace}>
            {loading ? (
                <Loader />
            ) : error ? (
                <p className={classes.error}>{error.message}</p>
            ) : (
                parsedResults &&
                parsedResults !== "null" && (
                    <pre className={classes.retulsts}>{parsedResults}</pre>
                )
            )}
        </div>
    );
};

export default ResultsPlace;
