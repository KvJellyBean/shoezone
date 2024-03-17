const LocalStorage = (() => {
  // Local storage key and variable to hold saved data
  const STORAGE_KEY = "Shoezone";
  let savedData = {};

  // Check browser support for local storage
  function isStorageAvailable() {
    if (typeof localStorage === undefined) {
      return false;
    }
    return true;
  }

  // Save data product
  function saveData(data) {
    if (isStorageAvailable()) {
      const dataJSON = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, dataJSON);
    }
  }

  // Load data from local storage
  function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = JSON.parse(data);

    if (parsedData !== null) {
      savedData = parsedData;
    }
  }

  // Take the savedData value
  function getSavedData() {
    return savedData;
  }

  return {
    isStorageAvailable,
    loadData,
    saveData,
    getSavedData,
  };
})();

export default LocalStorage;
