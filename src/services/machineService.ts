import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Machine, CreateMachineInput, UpdateMachineInput } from '../types/machine';

const MACHINES_COLLECTION = 'machines';

/**
 * Checks whether a given machineId is already registered for this user.
 * If excludeDocId is provided (e.g. during edit), that document is excluded from the collision check.
 */
export async function checkMachineIdUnique(
  userId: string,
  machineId: string,
  excludeDocId?: string
): Promise<boolean> {
  const normalizedId = machineId.trim().toUpperCase();
  const q = query(
    collection(db, MACHINES_COLLECTION),
    where('userId', '==', userId),
    where('machineId', '==', normalizedId)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return true;

  if (excludeDocId) {
    const isOnlySelf = snapshot.docs.every((d) => d.id === excludeDocId);
    return isOnlySelf;
  }

  return false;
}

/**
 * Subscribes to real-time machine updates for a specific authenticated user.
 * Returns an unsubscribe callback function.
 */
export function subscribeUserMachines(
  userId: string,
  onData: (machines: Machine[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, MACHINES_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Machine[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || userId,
          machineName: data.machineName || 'Unnamed Machine',
          machineId: data.machineId || d.id,
          machineType: data.machineType || 'Induction Motor',
          location: data.location || 'Unassigned',
          ratedVoltage: Number(data.ratedVoltage) || 230,
          ratedCurrent: Number(data.ratedCurrent) || 0,
          frequency: Number(data.frequency) || 50,
          manufacturer: data.manufacturer || '',
          modelNumber: data.modelNumber || '',
          ratedPower: data.ratedPower !== undefined && data.ratedPower !== null ? Number(data.ratedPower) : null,
          installationDate: data.installationDate || null,
          description: data.description || '',
          sensorConnected: Boolean(data.sensorConnected),
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
        } as Machine;
      });

      // Sort client-side by creation timestamp descending to guarantee consistent ordering without requiring composite index
      list.sort((a, b) => {
        const getSec = (item: Machine) => {
          if (!item.createdAt) return 0;
          if (typeof item.createdAt === 'object' && 'seconds' in item.createdAt) {
            return item.createdAt.seconds;
          }
          if (typeof item.createdAt === 'string') {
            return new Date(item.createdAt).getTime() / 1000;
          }
          return 0;
        };
        return getSec(b) - getSec(a);
      });

      onData(list);
    },
    (err) => {
      console.error('[IronPulse MachineService] Real-time subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Registers a new machine in Firestore for the current user.
 */
export async function createMachine(input: CreateMachineInput): Promise<string> {
  const isUnique = await checkMachineIdUnique(input.userId, input.machineId);
  if (!isUnique) {
    throw new Error(`Machine ID "${input.machineId.toUpperCase()}" is already registered. Please specify a unique ID.`);
  }

  const cleanData = {
    userId: input.userId,
    machineName: input.machineName.trim(),
    machineId: input.machineId.trim().toUpperCase(),
    machineType: input.machineType,
    location: input.location.trim(),
    ratedVoltage: Number(input.ratedVoltage),
    ratedCurrent: Number(input.ratedCurrent),
    frequency: Number(input.frequency),
    manufacturer: input.manufacturer?.trim() || '',
    modelNumber: input.modelNumber?.trim() || '',
    ratedPower: input.ratedPower !== null && input.ratedPower !== undefined ? Number(input.ratedPower) : null,
    installationDate: input.installationDate || null,
    description: input.description?.trim() || '',
    sensorConnected: Boolean(input.sensorConnected),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, MACHINES_COLLECTION), cleanData);
  return docRef.id;
}

/**
 * Updates an existing machine record in Firestore.
 */
export async function updateMachine(
  userId: string,
  machineDocId: string,
  input: UpdateMachineInput
): Promise<void> {
  if (input.machineId) {
    const isUnique = await checkMachineIdUnique(userId, input.machineId, machineDocId);
    if (!isUnique) {
      throw new Error(`Machine ID "${input.machineId.toUpperCase()}" is already registered by another machine.`);
    }
  }

  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (input.machineName !== undefined) payload.machineName = input.machineName.trim();
  if (input.machineId !== undefined) payload.machineId = input.machineId.trim().toUpperCase();
  if (input.machineType !== undefined) payload.machineType = input.machineType;
  if (input.location !== undefined) payload.location = input.location.trim();
  if (input.ratedVoltage !== undefined) payload.ratedVoltage = Number(input.ratedVoltage);
  if (input.ratedCurrent !== undefined) payload.ratedCurrent = Number(input.ratedCurrent);
  if (input.frequency !== undefined) payload.frequency = Number(input.frequency);
  if (input.manufacturer !== undefined) payload.manufacturer = input.manufacturer.trim();
  if (input.modelNumber !== undefined) payload.modelNumber = input.modelNumber.trim();
  if (input.ratedPower !== undefined) {
    payload.ratedPower = input.ratedPower !== null ? Number(input.ratedPower) : null;
  }
  if (input.installationDate !== undefined) payload.installationDate = input.installationDate;
  if (input.description !== undefined) payload.description = input.description.trim();
  if (input.sensorConnected !== undefined) payload.sensorConnected = Boolean(input.sensorConnected);

  const docRef = doc(db, MACHINES_COLLECTION, machineDocId);
  await updateDoc(docRef, payload);
}

/**
 * Permanently deletes a registered machine document from Firestore.
 */
export async function deleteMachine(machineDocId: string): Promise<void> {
  const docRef = doc(db, MACHINES_COLLECTION, machineDocId);
  await deleteDoc(docRef);
}
