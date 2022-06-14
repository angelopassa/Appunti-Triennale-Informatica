function QuickSort(A, p, r) {
    if (p < r) {
        q = Partiziona(A, p, r);
        QuickSort(a, p, q - 1);
        QuickSort(a, q + 1, r);
    }
}

function Partiziona(A, p ,r) {
    let x = A[r];
    let i = p - 1;
    for(let j = p; j <= r - 1; j++){
        if(A[j] <= x){
            i = i + 1;
            Swap(A[i], A[j]);
        }
    }
    Swap(A[i + 1], A[r]);
    return i + 1;
}