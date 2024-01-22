const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const { Location } = require("..");
const { APIError } = require("../../../common/helper/errors/apiError");
const { StatusCodes } = require("http-status-codes");

describe("Location Service", () => {
  let locationService;
  let findOneStub;
  let saveStub;
  let getLocationStub;
  let softDeleteStub;
  let restoreStub;
  beforeEach(() => {
    locationService = new Location();
    findOneStub = sinon.stub(locationService.Location, "findOne");
    saveStub = sinon.stub(mongoose.Model.prototype, "save");
    softDeleteStub = sinon.stub(locationService.Location, "softDelete");
    restoreStub = sinon.stub(locationService.Location, "restore");
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("Create Location", () => {
    it("should throw an APIError when data is not provided with status code 400", async () => {
      const data = null;
      try {
        await locationService.createLocation(data);
      } catch (error) {
        expect(error).to.be.an.instanceOf(APIError);
        expect(error.message).to.equal("Data is required.");
        expect(error.httpStatusCode).to.equal(StatusCodes.BAD_REQUEST);
      }
    });

    it("should create a location", async () => {
      const data = {
        name: "Test Location",
        geometry: "Test Geometry",
        direction: "Test Direction",
      };
      saveStub.resolves(data);

      const result = await locationService.createLocation(data);

      expect(saveStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(data);
    });
  });
  describe("Get Location", () => {
    it("should return an existing location", async () => {
      const query = { _id: "existingId" };
      const existingLocation = {
        _id: "existingId",
        name: "Existing Location",
      };
      findOneStub.resolves(existingLocation);
      const result = await locationService.getLocation(query);

      expect(result).to.deep.equal(existingLocation);
      expect(findOneStub.calledOnceWithExactly(query)).to.be.true;
    });
    it("should throw an error when location is not found", async () => {
      const query = { _id: "nonexistentId" };
      findOneStub.resolves(null);
      try {
        await locationService.getLocation(query);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(findOneStub.calledOnceWithExactly(query)).to.be.true;
        expect(error).to.be.an.instanceOf(APIError);
        expect(error.httpStatusCode).to.equal(StatusCodes.NOT_FOUND);
        expect(error.message).to.equal("Location not found with given query.");
      }
    });
  });
  describe("Update Location Info", () => {
    it("should update location information", async () => {
      const id = "mockedId";
      const location = {
        _id: id,
        name: "Old Name",
        geometry: "Old Geometry",
        direction: "Old Direction",
        save: sinon.stub().resolves({
          _id: "mockedId",
          name: "New Name",
          geometry: "New Geometry",
          direction: "New Direction",
        }),
      };
      sinon.stub(locationService, "getLocation").resolves(location);
      const updateData = {
        name: "New Name",
        geometry: "New Geometry",
        direction: "New Direction",
      };

      const updatedLocation = await locationService.updateLocationInfo(
        id,
        data
      );
      expect(updatedLocation).to.deep.equal({ _id: id, ...updateData });
      expect(location.save.called).to.be.true;
      expect(locationService.getLocation.calledOnce).to.be.true;
    });

    it("should throw an APIError when the Location is not found with status code 404", async () => {
      const id = "nonexistentId";
      const data = {
        name: "New Name",
        geometry: { lat: 123, lng: 456 },
        direction: "North",
      };
      findOneStub.resolves(null);
      try {
        await locationService.updateLocationInfo(id, data);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).to.be.an.instanceOf(APIError);
        expect(error.httpStatusCode).to.equal(StatusCodes.NOT_FOUND);
        expect(error.message).to.equal("Location not found with given query.");
      }
    });
  });
  describe("List Locations", () => {
    it("should list locations with pagination", async () => {
      const query = { role: "admin" };
      const options = { page: 1, limit: 10 };

      const paginatedResults = {
        docs: [
          { _id: "location1", role: "admin" },
          { _id: "location2", role: "admin" },
        ],
        totalDocs: 2,
        limit: 10,
        page: 1,
        totalPages: 1,
      };
      sinon
        .stub(locationService.Location, "paginate")
        .resolves(paginatedResults);
      const result = await locationService.listLocations(query, options);
      expect(result.docs).to.deep.equal(paginatedResults.docs);
      expect(result.totalDocs).to.equal(paginatedResults.totalDocs);
      expect(result.limit).to.equal(paginatedResults.limit);
      expect(result.page).to.equal(paginatedResults.page);
      expect(result.totalPages).to.equal(paginatedResults.totalPages);
    });
  });
  describe("softRemoveLocation", () => {
    it("should soft remove an location", async () => {
      const locationId = "some-location-id";
      const mockLocation = {
        _id: locationId,
      };
      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(mockLocation);
      softDeleteStub.resolves({ deleted: 1 });

      const result = await locationService.softRemoveLocation(locationId);

      expect(result).to.deep.equal(mockLocation);

      // Verify that the required methods were called with the correct arguments
      expect(getLocationStub.calledOnceWith({ _id: locationId })).to.be.true;
      expect(softDeleteStub.calledOnceWith({ _id: locationId })).to.be.true;
    });

    it("should not soft remove an location if it does not exist", async () => {
      const locationId = "non-existent-location-id";

      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(null);
      softDeleteStub.resolves();

      const result = await locationService.softRemoveLocation(locationId);

      // Assertions
      expect(result).to.be.null;
      expect(getLocationStub.calledOnceWith({ _id: locationId })).to.be.true;
      expect(softDeleteStub.notCalled).to.be.false;
    });
  });
  describe("restoreLocation Service", () => {
    it("should restore an location if found", async () => {
      const locationId = "some-unique-id";
      const mockLocation = {
        _id: locationId,
      };
      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(mockLocation);
      restoreStub.resolves();
      const result = await locationService.restoreLocation(locationId);
      expect(result).to.deep.equal(mockLocation);
      expect(getLocationStub.calledOnceWith({ _id: locationId })).to.be.true;
      expect(restoreStub.calledOnceWith({ _id: locationId })).to.be.true;
    });
    it("should return undefined if location not found", async () => {
      const locationId = "non-existent-id";
      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(null);

      const result = await locationService.restoreLocation(locationId);

      expect(result).to.be.undefined;
      expect(getLocationStub.calledOnceWith({ _id: locationId })).to.be.true;
    });
  });
  describe("hardRemoveLocation", () => {
    it("should remove an existing location when a valid ID is provided", async () => {
      const validId = mongoose.Types.ObjectId();
      const existingLocation = {
        _id: validId,
        name: "New Name",
        geometry: { lat: 123, lng: 456 },
        direction: "North",
      };
      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(existingLocation);
      const deleteOneStub = sinon.stub(locationService.Location, "deleteOne");
      deleteOneStub.resolves({ n: 1 });

      const result = await locationService.hardRemoveLocation(validId);
      expect(result).to.deep.equal(existingLocation);
      expect(getLocationStub.calledOnceWith({ _id: validId })).to.be.true;
      expect(deleteOneStub.calledOnceWith({ _id: validId })).to.be.true;
    });
    it("should return null when no location is found with the provided ID", async () => {
      const invalidId = "non_existent_id";

      const getLocationStub = sinon
        .stub(locationService, "getLocation")
        .resolves(null);
      
      const result = await locationService.hardRemoveLocation(invalidId);

      expect(getLocationStub.calledWith({ _id: invalidId })).to.be.true;
      expect(result).to.be.null;
    });
  });
});
