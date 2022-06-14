function InsertionSort(A) {
    for(let j = 1; j < A.length; j++){
        let key = A[j];
        i = j - 1;
        while(i >= 0 && A[i] > key){
            A[i + 1] = A[i];
            i = i - 1;
        }
        A[i + 1] = key;
    }
}