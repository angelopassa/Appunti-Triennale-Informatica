function SelectionSort(A) {
    for(let i = 0; i < A.length - 1; i++){
        let min = i;
        for(let j = i + 1; j < A.length; j++){
            if(A[j] < A[min]) min = j;
        }
        Swap(A[i], A[min]);
    }
}