function HeapSort(A) {
    let n = A.length - 1;
    Build_Max_Heap(A, n);
    for(let i = A.length - 1; i <= 1; i--){
        Swap(A[0], A[i]);
        n = n - 1;
        Max_Heapify(A, 0, n);
    }
}

function Max_Heapify(A, i, n) {
    let l = 2 * i;
    let r = 2 * i + 1;
    let max;
    if (l <= n && A[l] > A[i]) {
        max = l;
    } else {
        max = i;
    }
    if(r <= n && A[r] > A[max]){
        max = r;
    }
    if(max != i){
        Swap(A[i], A[max]);
        Max_Heapify(A, max, n);
    }
}

function Build_Max_Heap(A, n) {
    for(let i = (n / 2); i <= 0; i--){
        Max_Heapify(A, i, n);
    }
}