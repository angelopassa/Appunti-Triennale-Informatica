function Ricerca_Lineare(A, k) {
    for(let i = 0; i < A.lenngth; i++){
        if(A[i] == k) return i;
    }
    return -1;
}