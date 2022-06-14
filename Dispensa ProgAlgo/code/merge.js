function MergeSort(A, p, r) {
    if(p < r){
        let q = (p + r) / 2;
        MergeSort(A, p, q);
        MergeSort(A, q + 1, r);
        Merge(A, p, q, r);
    }
}

function Merge(A, p, q, r) {
    let n1 = q - p + 1;
    let n2 = r - q;
    let L = new Array(n1 + 1);
    let R = new Array(n2 + 1);
    for(let i = 0; i < n1; i++) L[i] = A[p + i - 1];
    for(let j = 0; j < n2; j++) R[j] = A[q + j];
    L[n1] = +Infinity;
    R[n2] = +Infinity;
    let i = 0;
    let j = 0;
    for(let k = p; k < r; k++){
        if(L[i] <= R[j]){
            A[k] = L[i];
            i = i + 1;
        }
        else{
            A[k] = R[j];
            j = j + 1;
        }
    }
}