const _public = {};

_public.positionNotAngledSlices = containerElement => {
  positionNotAngledSlices(containerElement, getAllSlicesElements(containerElement));
};

function getAllSlicesElements(containerElement){
  return containerElement.querySelectorAll('[data-slice]');
}

function positionNotAngledSlices(containerElement, slices){
  for (var i = 0; i < slices.length; i++)
    if(shouldOffsetSiblingSlice(slices, i))
      offsetSlice(slices[i+1], calcOffsetAmount(containerElement, slices[i]));
}

function shouldOffsetSiblingSlice(slices, currentSliceIndex){
  return  isAngledSlice(slices[currentSliceIndex]) &&
          slices[currentSliceIndex+1] &&
          !isAngledSlice(slices[currentSliceIndex+1]);
}

function isAngledSlice(slice){
  return slice.classList.contains('slice-angled');
}

function calcOffsetAmount(containerElement, slice){
  const topbarHeight = getTopbarHeight(containerElement);
  return slice.offsetHeight - topbarHeight;
}

function getTopbarHeight(containerElement){
  return containerElement.querySelector('[data-topbar]').offsetHeight;
}

function offsetSlice(slice, offsetAmount){
  slice.style.marginTop = `${offsetAmount}px`;
}

export default _public;
